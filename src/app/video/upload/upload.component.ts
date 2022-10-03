import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';// npm i uuid @types/uuid
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep: boolean = false;
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });
  uploadForm = new FormGroup({
    title: this.title
  });
  showAlert = false;
  alertColor = '';
  alertMsg = '';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot = '';
  screenshotTask?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    this.auth.user.subscribe(user => this.user = user);
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    this.task?.cancel();// In case that we move to other page we cancell the upload.
  }

  async storeFile($event: Event) {
    // If the user is already uploading a file
    // then stops the option to upload another:
    if(this.ffmpegService.isRunning) {
      return;
    }

    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null;

    // Mime type = video/mp4:
    if(!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);

    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(
      // this regular expression deletes the file extension:
      this.file.name.replace(/\.[^/.]+$/, '')
    );

    this.nextStep = true;
  }

  uploadFile() {
    /* It is nessesary to disable the form during the upload of the file: */
    this.uploadForm.disable();// disable forms are available in all types of forms.

    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is beign uploaded.';
    this.inSubmission = true;
    this.showPercentage = true;

    const uid = uuid();
    const clipPath = `clips/${uid}.mp4`;
    const screenshotBlob = this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${uid}.png`;

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);// Points to the file
    
    this.screenshotTask = this.storage.upload(
      screenshotPath, 
      screenshotBlob
    );
    const screenshotRef = this.storage.ref(screenshotPath);
    
    // combineLatest handles multiple subscriptions:
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
        const [clipProgress, screenshotProgress] = progress;

        if(!clipProgress || !screenshotProgress) {
          return;
        }

        const total = clipProgress + screenshotProgress;

        this.percentage = (total as number) / 200;
      });

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ])
      .pipe(
        // Then enter to an inner observable:
        switchMap(() => forkJoin([
          clipRef.getDownloadURL(),
          screenshotRef.getDownloadURL()
        ]))
      )
      .subscribe({
        next: async(urls) => {
          const [clipUrl, screenshotURL] = urls;
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipPath}.mp4`,
            url: clipUrl,
            screenshotURL, 
            screenshotFileName: `${clipPath}.mp4`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          }
          
          const clipDocRef = await this.clipsService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg = 'Success! Your clip is now ready to share with the world.';
          this.showPercentage = false;

          setTimeout(() => { 
            this.router.navigate([
              'clip', 
              clipDocRef.id
            ])
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();

          this.alertColor = 'red';
          this.alertMsg = 'Upload failed! Please try again later.';
          this.showPercentage = false;
          this.inSubmission = true;
          console.error(error);
        }
      });
  }
}
