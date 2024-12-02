import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class DataService {

	private dataUrl = "/data/data.json";

	constructor(private http: HttpClient) { }

	getData(): Observable<any> {
		return this.http
			.get(this.dataUrl)
			.pipe(
				catchError(error => {
					console.error("Error fetching data: ", error);
					return of({error: "No se pudo cargar la información."});
				})
			);
	}
}
