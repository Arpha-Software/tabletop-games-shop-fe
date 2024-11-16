
export default function Catalogue(params: any) {
  return (
    <>
      <h1>Catalogue page</h1>
      <p>Chosen category: {params.searchParams.category}</p>
      <p>Chosen offer: {params.searchParams.offers}</p>
    </>
  );
}
