
export default function Product(params: any) {
  return (
    <>
      <h1>Catalogue page</h1>
      <p>Chosen product: {params.params.product}</p>
    </>
  );
}
