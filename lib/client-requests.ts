export async function deleteExtraction(id: string) {
  const res = await fetch(`/api/dashboard/extraction?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    console.error(res.statusText, res.status);
  }
}

export async function getObjectUrl(extractionId: string) {
  const res = await fetch(`/api/signed-url?id=${extractionId}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("Something went wrong. Please try again later.");
  }

  const { url } = await res.json();
  return url as string;
}

export async function updateStructuredData<T>(data: T, endpoint: string) {
  const res = await fetch(`/api/dashboard/${endpoint}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    if (res.status === 422) {
      throw new Error(
        "Please make sure all the field values are valid and try again."
      );
    }
    throw new Error("Something went wrong. Please try again later.");
  }
  const fetchedData = await res.json();
  return fetchedData as T;
}
