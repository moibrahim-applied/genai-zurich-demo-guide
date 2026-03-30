interface TalkTrackProps {
  text: string;
}

export default function TalkTrack({ text }: TalkTrackProps) {
  return (
    <div className="my-3 px-4 py-3 bg-gray-100 border-l-4 border-gray-300 rounded-r-md">
      <p className="text-sm text-gray-600 italic">
        <span className="font-semibold not-italic text-gray-500">
          Talk track:{" "}
        </span>
        {text}
      </p>
    </div>
  );
}
