import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface CopyButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  copyText: string;
}

export default function CopyButton({ copyText, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      {...props}
      onClick={() => {
        navigator.clipboard.writeText(copyText);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }}
      children={copied ? "Copied!" : props.children}
    />
  );
}
