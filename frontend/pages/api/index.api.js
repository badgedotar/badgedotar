export default function handler(req, res) {
  return res.status(200).json({
    name: 'Badge.ar - API',
    version: '0.0.2',
  })
}