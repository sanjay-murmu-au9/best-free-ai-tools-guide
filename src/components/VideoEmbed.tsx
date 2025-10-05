interface VideoEmbedProps {
  title: string;
  videoId?: string;
  placeholder?: string;
}

export default function VideoEmbed({ title, videoId, placeholder }: VideoEmbedProps) {
  if (!videoId) {
    return (
      <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">▶️</div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-300 text-sm">
            {placeholder || 'Tutorial video coming soon'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}