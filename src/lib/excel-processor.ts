import * as XLSX from 'xlsx';

export async function processExcel(file: File, marca: string) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        let listaFinal: any[] = [];

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet);
          
          rows.forEach((row: any) => {
            // Buscamos o código independente de como ele esteja escrito
            const codigo = row['Código Produto'] || row['codigo_produto'] || row['Código'];
            
            if (codigo) {
              listaFinal.push({
                codigo_produto: String(codigo).trim(),
                marca: marca,
                // Aqui guardamos TODA a linha da planilha (Grupo, Descrição, etc)
                dados: row 
              });
            }
          });
        });

        if (listaFinal.length === 0) reject("Nenhum produto encontrado com a coluna 'Código Produto'");
        resolve(listaFinal);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}