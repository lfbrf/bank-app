import { handleDeposit } from "../shared";

export async function POST(req, res) {
  return await handleDeposit(req, 'checking');
}
