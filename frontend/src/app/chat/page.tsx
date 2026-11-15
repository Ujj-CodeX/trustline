import { ChatPage } from "@/screens/ChatPage";
import { DEFAULT_COUNTRIES } from "@/lib/countries";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  return (
    <ChatPage
      initialQuery={getParam(params.q)}
      selectedCountry={getParam(params.country)}
      resumeFromStorage={getParam(params.resume) === "true"}
      countries={DEFAULT_COUNTRIES}
    />
  );
}
