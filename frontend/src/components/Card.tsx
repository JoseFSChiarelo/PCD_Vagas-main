export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded shadow-sm p-4 hover:shadow-md transition" role="region">{children}</div>
  );
}