import ProcedureDetailPage from "./procedurePage";
type PageProps = {
  params: Promise<{ procedureId: string }>;
}
export default async function page(props: PageProps){
  const params = await props.params
  return <ProcedureDetailPage procedureId={params.procedureId} />
}