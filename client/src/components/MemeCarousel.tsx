import { Laugh, Upload, Heart, Share2, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Meme } from "@shared/schema";
import aiImg1 from "@assets/generated_images/Football_celebration_meme_cartoon_de70cf47.png";
import aiImg2 from "@assets/generated_images/Goalkeeper_fail_meme_cartoon_b7d29a9c.png";
import aiImg3 from "@assets/generated_images/Referee_controversy_meme_cartoon_01c5281f.png";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function MemeCarousel() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const { toast } = useToast();

  const { data: memes = [], isLoading } = useQuery<Meme[]>({
    queryKey: ['/api/memes'],
  });

  const guestId = ((): string => {
    const existing = localStorage.getItem('guestId');
    if (existing) return existing;
    const id = `guest_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('guestId', id);
    return id;
  })();

  const { data: genStatus } = useQuery<{ date: string; globalCount: number; globalLimit: number; userCount: number; userLimit: number }>({
    queryKey: ['/api/memes/generate/status'],
    queryFn: async () => {
      const res = await fetch('/api/memes/generate/status', { headers: { 'x-guest-id': guestId } });
      return await res.json();
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('POST', `/api/memes/${id}/like`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/memes'] });
    },
  });

  const handleUpload = () => {
    setOpen(true);
    // Reset form when opening dialog
    setImageUrl("");
    setSelectedFile(null);
    setImagePreview("");
    setCaption("");
    setUploadMethod('url');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(""); // Clear URL when file is selected

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setSelectedFile(null); // Clear file when URL is entered
    setImagePreview("");
  };

  const handleSubmit = async () => {
    if (!caption.trim()) {
      toast({
        variant: "destructive",
        title: "Missing caption",
        description: "Please provide a caption for your meme",
      });
      return;
    }

    if (!imageUrl.trim() && !selectedFile) {
      toast({
        variant: "destructive",
        title: "Missing image",
        description: "Please provide either an image URL or select a file",
      });
      return;
    }

    try {
      setSubmitting(true);

      let finalImageUrl = imageUrl.trim();

      // If file is selected, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('caption', caption.trim());

        const uploadRes = await fetch('/api/memes/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json().catch(() => ({}));
          throw new Error(data?.error || 'Failed to upload image');
        }

        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.imageUrl;
      }

      // Create the meme
      const res = await apiRequest('POST', '/api/memes', {
        imageUrl: finalImageUrl,
        caption: caption.trim()
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to create meme');
      }

      setOpen(false);
      setImageUrl("");
      setSelectedFile(null);
      setImagePreview("");
      setCaption("");
      setUploadMethod('url');

      toast({ title: "Meme uploaded", description: "Your meme was shared successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/memes'] });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload failed", description: err?.message || "Please try again" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (id: string) => {
    likeMutation.mutate(id);
  };

  const handleShare = (id: string) => {
    console.log(`Shared meme: ${id}`);
  };

  if (isLoading) {
    return (
      <section className="w-full" data-section="memes">
        <div className="mb-4 flex items-center gap-2">
          <Laugh className="h-6 w-6 text-chart-5" />
          <h2 className="font-display text-2xl font-bold md:text-3xl">Trending Memes</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          <div className="h-64 w-80 animate-pulse rounded-xl bg-muted"></div>
          <div className="h-64 w-80 animate-pulse rounded-xl bg-muted"></div>
          <div className="h-64 w-80 animate-pulse rounded-xl bg-muted"></div>
        </div>
      </section>
    );
  }

  // Two or three AI-generated meme placeholders (latest first)
  const now = Date.now();
  const aiMemes: Array<Meme & { __ai?: boolean }> = [
    {
      id: 'ai-1',
      imageUrl: aiImg1,
      caption: 'When your team finally scores in 90+4 🥳',
      likes: 0,
      // @ts-ignore createdAt is Date at runtime
      createdAt: new Date(now - 30_000),
      __ai: true,
    } as any,
    {
      id: 'ai-2',
      imageUrl: aiImg2,
      caption: 'Goalkeeper after a butterfingers moment 😅',
      likes: 0,
      // @ts-ignore
      createdAt: new Date(now - 60_000),
      __ai: true,
    } as any,
    {
      id: 'ai-3',
      imageUrl: aiImg3,
      caption: 'When VAR says “play on” after chaos 🤯',
      likes: 0,
      // @ts-ignore
      createdAt: new Date(now - 90_000),
      __ai: true,
    } as any,
  ];

  // Merge AI + server memes and sort by latest first
  const mergedMemes = [...aiMemes, ...memes].sort((a: any, b: any) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  return (
    <section className="w-full" data-section="memes">
      <div className="mb-4 flex items-center gap-2">
        <Laugh className="h-6 w-6 text-chart-5" />
        <h2 className="font-display text-2xl font-bold md:text-3xl">Trending Memes</h2>
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try {
                const res = await fetch('/api/memes/generate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-guest-id': guestId,
                  },
                  body: JSON.stringify({ topic: 'football banter' }),
                });
                if (!res.ok) {
                  const data = await res.json().catch(() => ({} as any));
                  throw new Error(data?.error || 'Failed to generate meme');
                }
                if (!res.ok) {
                  const data = await res.json().catch(() => ({}));
                  throw new Error(data?.error || 'Failed to generate meme');
                }
                toast({ title: 'Generated', description: 'Meme created by Mchambuzi Halisi' });
                queryClient.invalidateQueries({ queryKey: ['/api/memes'] });
                queryClient.invalidateQueries({ queryKey: ['/api/memes/generate/status'] });
              } catch (e: any) {
                toast({ variant: 'destructive', title: 'Error', description: e?.message || 'Try again' });
              }
            }}
            data-testid="button-generate-meme"
          >
            Generate Meme {genStatus ? `(${Math.max(0, genStatus.globalLimit - genStatus.globalCount)} left)` : ''}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        <Card
          className="hover-elevate min-w-[280px] flex-shrink-0 cursor-pointer snap-start overflow-hidden border-2 border-dashed md:min-w-[320px]"
          onClick={handleUpload}
          data-testid="button-upload-meme"
        >
          <div className="flex h-64 flex-col items-center justify-center gap-3 p-6">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold">Upload Your Meme</h3>
            <p className="text-center text-sm text-muted-foreground">
              Be the first to make hilarious meme. 1 per user daily.
            </p>
          </div>
        </Card>

        {mergedMemes.map((meme: any) => (
          <Card
            key={meme.id}
            className="group relative min-w-[280px] flex-shrink-0 snap-start overflow-hidden md:min-w-[320px]"
            data-testid={`meme-${meme.id}`}
          >
            <img
              src={meme.imageUrl}
              alt={meme.caption}
              className="h-64 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {meme.__ai && (
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-chart-2/20 px-2 py-0.5 text-xs text-white">
                  <Bot className="h-3 w-3 text-chart-2" /> AI
                </div>
              )}
              <p className="mb-3 text-sm font-medium text-white">{meme.caption}</p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => handleLike(meme.id)}
                  data-testid={`button-like-${meme.id}`}
                >
                  <Heart className="mr-1 h-4 w-4" />
                  {meme.likes}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => {
                    try {
                      if (navigator.share) {
                        navigator.share({ title: 'Ball Mtaani Meme', text: meme.caption, url: meme.imageUrl });
                      } else {
                        navigator.clipboard?.writeText(meme.imageUrl);
                        toast({ title: 'Link copied', description: 'Meme URL copied to clipboard' });
                      }
                    } catch {}
                  }}
                  data-testid={`button-share-${meme.id}`}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Your Meme</DialogTitle>
            <DialogDescription>Share a football meme with the community</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Upload method selection */}
            <div className="space-y-2">
              <Label>Choose upload method</Label>
              <div className="flex gap-2">
                <Button
                  variant={uploadMethod === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadMethod('url')}
                >
                  Image URL
                </Button>
                <Button
                  variant={uploadMethod === 'file' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUploadMethod('file')}
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {/* URL input */}
            {uploadMethod === 'url' && (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                />
              </div>
            )}

            {/* File upload */}
            {uploadMethod === 'file' && (
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Select Image File</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <div className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            )}

            {/* Image preview */}
            {(imagePreview || imageUrl) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg p-2 bg-muted/50">
                  <img
                    src={imagePreview || imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              </div>
            )}

            {/* Caption */}
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                rows={3}
                placeholder="Your funny caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Uploading...' : 'Share Meme'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
