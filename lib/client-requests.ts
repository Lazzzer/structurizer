export async function deleteExtraction(uuid: string) {
  const res = await fetch(`/api/delete/extraction?uuid=${uuid}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

export async function updateReceipt(receipt: any) {
  const res = await fetch(`/api/receipts/update`, {
    method: "PUT",
    body: JSON.stringify(receipt),
  });
  console.log(res.statusText, res.status);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

export async function updateInvoice(invoice: any) {
  const res = await fetch(`/api/invoices/update`, {
    method: "PUT",
    body: JSON.stringify(invoice),
  });
  console.log(res.statusText, res.status);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}

export async function updateCardStatement(cardStatement: any) {
  const res = await fetch(`/api/card-statements/update`, {
    method: "PUT",
    body: JSON.stringify(cardStatement),
  });
  console.log(res.statusText, res.status);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
}
