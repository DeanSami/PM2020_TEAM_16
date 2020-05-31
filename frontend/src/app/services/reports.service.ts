import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor() { }

  createReport(columns: any[], rows: any[], title: string) {
    let displayColumns = '';
    let displayRows = '';
    columns.forEach(col => displayColumns += '<th>' + col.value + '</th>');
    rows.forEach(row => {
      displayRows += '<tr>';
      columns.forEach(col => {
        displayRows += '<td>' + row[col.key] + '</td>';
      });
      displayRows += '</tr>';
    });
    const displayHtml = `
      <h1>${title}</h1>
      <table class="table">
        <tr>
            ${displayColumns}
        </tr>
        ${displayRows}
      </table>
    `;
    return displayHtml;
  }
}
