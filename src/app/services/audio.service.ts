import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
	providedIn: "root"
})
export class AudioService {
	private audioPlayer: HTMLAudioElement = new Audio();
	private isPlayingSubject = new BehaviorSubject<boolean>(false);

	constructor() {
		// Configurar eventos del audio
		this.audioPlayer.onended = () => {
			this.isPlayingSubject.next(false);
		};

		this.audioPlayer.onpause = () => {
			this.isPlayingSubject.next(false);
		};

		this.audioPlayer.onplay = () => {
			this.isPlayingSubject.next(true);
		};
	}

	get isPlaying$(): Observable<boolean> {
		return this.isPlayingSubject.asObservable();
	}

	get isPlaying(): boolean {
		return this.isPlayingSubject.value;
	}

	playAudio(audioPath: string): Promise<void> {
		if (this.isPlaying) {
			return Promise.resolve();
		}

		this.audioPlayer.src = `./data/audios/${audioPath}`;
		this.audioPlayer.load();
		return this.audioPlayer.play().catch(error => {
			console.error("Error al reproducir el audio:", error);
			this.isPlayingSubject.next(false);
		});
	}
}
