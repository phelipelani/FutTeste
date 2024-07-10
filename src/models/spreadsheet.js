import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const tenantId = process.env.TENANT_ID;
const excelFilePath = process.env.EXCEL_FILE_PATH;

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

const graphClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
      return tokenResponse.token;
    },
  },
});

const getExcelFileId = async () => {
  const response = await graphClient
    .api(`/me/drive/root:${excelFilePath}`)
    .get();
  return response.id;
};

const loadData = async () => {
  const fileId = await getExcelFileId();
  const response = await graphClient
    .api(`/me/drive/items/${fileId}/workbook/worksheets/Sheet1/usedRange`)
    .get();
  return response.values;
};

const saveData = async (newRow) => {
  const fileId = await getExcelFileId();
  await graphClient
    .api(`/me/drive/items/${fileId}/workbook/worksheets/Sheet1/usedRange`)
    .post({ values: [newRow] });
};

const isAdmin = async (username) => {
  const fileId = await getExcelFileId();
  const response = await graphClient
    .api(`/me/drive/items/${fileId}/workbook/worksheets/Admins/usedRange`)
    .get();
  return response.values.some(row => row.includes(username));
};

// Exportando as funções individualmente
export { loadData, saveData, isAdmin };