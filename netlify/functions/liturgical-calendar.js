export default async (req, context) => {
  return new Response(
    JSON.stringify({ message: "Function is working ✅" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};
