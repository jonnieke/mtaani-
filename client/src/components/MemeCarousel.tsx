import { Laugh, Upload, Heart, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Meme } from "@shared/schema";

export default function MemeCarousel() {
  const { data: memes = [], isLoading } = useQuery<Meme[]>({
    queryKey: ['/api/memes'],
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
    console.log("Upload meme clicked");
  };

  const handleLike = (id: string) => {
    likeMutation.mutate(id);
  };

  const handleShare = (id: string) => {
    console.log(`Shared meme: ${id}`);
  };

  if (isLoading) {
    return (
      <section className="w-full">
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

  return (
    <section className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <Laugh className="h-6 w-6 text-chart-5" />
        <h2 className="font-display text-2xl font-bold md:text-3xl">Trending Memes</h2>
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
              Share your football banter with the community
            </p>
          </div>
        </Card>

        {memes.map((meme) => (
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
                  onClick={() => handleShare(meme.id)}
                  data-testid={`button-share-${meme.id}`}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
