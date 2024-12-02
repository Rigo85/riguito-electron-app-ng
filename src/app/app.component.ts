import { Component, HostListener, OnInit } from "@angular/core";
import { DataService } from "./services/data.service";
import { NgIf } from "@angular/common";

@Component({
	selector: "app-root",
	imports: [
		NgIf
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss"
})
export class AppComponent implements OnInit {
	data?: { images: string[], audios: Record<string, string[]> } = undefined;
	errorMessage?: string = undefined;
	randomImage?: string = undefined;
	private audioPlayer?: HTMLAudioElement = undefined; // Instancia reutilizable de Audio

	constructor(private dataService: DataService) {}

	ngOnInit(): void {
		this.dataService.getData().subscribe({
			next: (response) => {
				if (response.error) {
					this.errorMessage = response.error; // Manejar el mensaje de error
				} else {
					this.data = response; // Datos cargados correctamente
					console.info(this.data);
				}
			},
			error: (error) => {
				console.error("Error inesperado:", error);
				this.errorMessage = "Error inesperado al cargar los datos.";
			},
			complete: () => {
				console.info("Carga de datos completada.");
			}
		});
	}

	@HostListener("document:keydown", ["$event"])
	onKeyPress(event: KeyboardEvent): void {
		if (this.data && this.data.images.length > 0) {
			// Selecciona una imagen aleatoria
			const randomIndex = Math.floor(Math.random() * this.data.images.length);
			this.randomImage = this.data.images[randomIndex];

			console.log("Imagen aleatoria:", this.randomImage);

			// (Opcional) Si deseas reproducir el audio asociado:
			const audioList = this.data.audios[this.randomImage] || [];
			if (audioList.length > 0) {
				this.playAudio(audioList[0]); // Reproduce el primer audio asociado
			}
		}
	}

	playAudio(audioFile: string): void {
		if (!this.audioPlayer) {
			this.audioPlayer = new Audio(); // Crear una única instancia
		}

		this.audioPlayer.src = `/data/audios/${audioFile}`;
		this.audioPlayer.load(); // Cargar el archivo de audio
		this.audioPlayer.play().catch((error) => {
			console.error("Error al reproducir el audio:", error);
		});
	}
}
