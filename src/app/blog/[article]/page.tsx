
export default function Article(params: any) {
  return (
    <>
      <h1>Article page</h1>
      <p>Artcile chosen: {params.params.article}</p>
    </>
  );
}
