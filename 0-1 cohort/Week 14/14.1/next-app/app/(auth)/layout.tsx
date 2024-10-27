export default function({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<div className="p-4 border-b text-center">
    Login now to get 20% off
    {children}
  </div>)
}
