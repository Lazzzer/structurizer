export async function deleteExtraction(id: string) {
  const res = await fetch(`/api/dashboard/extraction?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    console.error(res.statusText, res.status);
  }
}

export async function getObjectUrl(extractionId: string) {
  const res = await fetch(`/api/signed-url?uuid=${extractionId}`, {
    method: "GET",
  });
  const { url } = await res.json();
  return url as string;
}

export async function updateStructuredData<T>(data: T, endpoint: string) {
  const res = await fetch(`/api/dashboard/${endpoint}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Network response was not ok");
  const fetchedData = await res.json();

  return fetchedData as T;
}
