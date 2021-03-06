import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { saveAs } from '../../../../../../node_modules/file-saver/dist/FileSaver';

type EntityResponseType = HttpEvent<{}>;
type EntityArrayResponseType = HttpResponse<String[]>;

@Injectable({ providedIn: 'root' })
export class SendFileToServerService {
    public resourceUrl = SERVER_API_URL + 'api/log-files';
    public resourceUrlAddFromFile = SERVER_API_URL + 'api/log-files/add';
    public resourceDownloadUrl = SERVER_API_URL + 'api/get-log-file';
    public convertAndDownloadUrl = SERVER_API_URL + 'api/convert-and-download';

    constructor(private http: HttpClient) {}

    convertAndDownload(file: string): any {
        return this.http.get<any>(`${this.convertAndDownloadUrl}/${file}`, { responseType: 'blob' as 'json' }).subscribe(res => {
            const fileBlob = new Blob([res], { type: 'text/plain' });
            saveAs(fileBlob, 'converted-' + file);
        });
    }

    pushFileToStorage(file: File): Observable<EntityResponseType> {
        const formdata: FormData = new FormData();

        formdata.append('file', file);

        const req = new HttpRequest('POST', this.resourceUrl, formdata, {
            reportProgress: true,
            responseType: 'text'
        });

        return this.http.request(req);
    }

    getFiles(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<String[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(file: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${file}`, { observe: 'response' });
    }

    addLogs(file: string): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${this.resourceUrlAddFromFile}/${file}`, { observe: 'response' });
    }
}
