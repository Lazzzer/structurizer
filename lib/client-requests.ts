export async function deleteExtraction(id: string) {
  const res = await fetch(`/api/dashboard/extraction?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    console.error(res.statusText, res.status);
  }
}

export async function updateStructuredData(data: any, endpoint: string) {
  const res = await fetch(`/api/dashboard/${endpoint}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}
