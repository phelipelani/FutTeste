import spreadsheet from '../models/spreadsheet.js';
const { loadData, saveData, isAdmin } = spreadsheet;

const getData = async (req, res) => {
  try {
    const data = await loadData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username } = req.body;
  try {
    if (await isAdmin(username)) {
      res.json({ success: true, admin: true });
    } else {
      res.json({ success: true, admin: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addData = async (req, res) => {
  const { username, rodada, jogador, pontuacao, data, ...otherFields } = req.body;
  try {
    if (!await isAdmin(username)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const newRow = [rodada, jogador, pontuacao, data, ...Object.values(otherFields)];
    await saveData(newRow);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exportando os métodos
export { getData, login, addData };