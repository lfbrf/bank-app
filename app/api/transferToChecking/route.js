import { handleTransfer } from "../shared";

export async function POST(req, res) {
    return await handleTransfer(req, 'saving', 'checking');
}
