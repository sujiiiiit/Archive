
export function Footer({ title = "" }) {
  return (
    <footer className="fixed z-20 bottom-0 left-0 right-0 flex justify-start items-center p-5 bg-[radial-gradient(circle,rgba(0,0,0,0)_1px,var(--background)_1px)] bg-[length:4px_4px] backdrop-blur-[3px] text-[14px] leading-[14px]">
      <code className="font-GeistMono text-textPrimary">{title}</code>
    </footer>
  );
}
