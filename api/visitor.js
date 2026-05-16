export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST allowed' });
    }

    const data = req.body;

    console.log("Visitor received:", data);

    return res.status(200).json({
        success: true,
        message: "Visitor logged successfully"
    });
}