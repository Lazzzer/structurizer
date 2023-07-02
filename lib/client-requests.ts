export async function deleteExtraction(uuid: string) {
  const res = await fetch(`/api/delete/extraction?uuid=${uuid}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}
