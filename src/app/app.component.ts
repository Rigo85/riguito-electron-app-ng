import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { NgIf } from "@angular/common";
import { Subscription } from "rxjs";

import { AudioService } from "./services/audio.service";
import { DataService } from "./services/data.service";

@Component({
	selector: "app-root",
	imports: [
		NgIf
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.scss"
})
export class AppComponent implements OnInit, OnDestroy {
	data?: { images: string[], audios: Record<string, string[]> } = undefined;
	errorMessage?: string = undefined;
	randomImage?: string = undefined;
	private audioPlayer?: HTMLAudioElement = undefined; // Instancia reutilizable de Audio
	private shuffledImages: string[] = [];
	private audioSubscription?: Subscription = undefined;

	constructor(
		private dataService: DataService,
		private audioService: AudioService,
		private cdr: ChangeDetectorRef
	) {}

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

	ngOnDestroy(): void {
		if (this.audioSubscription) {
			this.audioSubscription.unsubscribe();
		}
	}

	private shuffleArray(array: any[]): any[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	@HostListener("document:keyup", ["$event"])
	onKeyPress(event: KeyboardEvent): void {
		const keys = [
			"Shift", "Control", "Alt", "Meta",
			...Array.from({length: 12}, (_, i) => `F${i + 1}`)
		];

		if (keys.includes(event.key)) {
			console.log(`Tecla "${event.key}" ignorada`);
			return;
		}

		if (this.audioService.isPlaying) {
			console.log("Audio en reproducción, ignorando evento de teclado");
			return;
		}

		if (this.data && this.data.images.length > 0) {
			this.randomImage = undefined;
			this.cdr.detectChanges();

			if (!this.shuffledImages?.length) {
				this.shuffledImages = this.shuffleArray([...this.data.images]);
			}
			this.randomImage = this.shuffledImages.pop();

			console.info("Random image:", this.randomImage);

			if (this.randomImage) {
				const audioList = this.data.audios[this.randomImage] || [];
				if (audioList.length > 0) {
					this.playAudio(audioList[0]);
				}
			}
		}
	}

	playAudio(audioFile: string): void {
		this.audioService.playAudio(audioFile);
	}
}
