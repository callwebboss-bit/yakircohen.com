interface Props {
  id?: string;
  children: React.ReactNode;
}

/**
 * Answer-first paragraph for AEO. Marks content as speakable for voice/AI
 * answer engines. Pair with SpeakableSchema on the same page.
 */
export default function AnswerBlock({ id = "answer", children }: Props) {
  return (
    <p
      id={id}
      data-speakable="true"
      className="text-lead text-foreground/80 leading-relaxed"
    >
      {children}
    </p>
  );
}
