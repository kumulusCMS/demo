import { Component, Input, OnInit } from '@angular/core';
import { ImgFormat, ImgService } from '../../services/img.service';

@Component({
  selector: 'img-shell',
  templateUrl: './img-shell.component.html',
})
export class ImgShellComponent implements OnInit {
  @Input()
  private format: ImgFormat;
  @Input()
  private set key(val: string) {
    this.imgSrc = this.img.getImage(this.format, val);
  }
  public imgSrc: string;

  constructor(private img: ImgService) {}

  public ngOnInit() {}
}
