import { EventEmitter, Injectable } from '@angular/core';
import { DataReadService, SettingsModel } from '@kumulus/ng-core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public selectedLang: string;
  public languageChanged = new EventEmitter<string>();
  private _settings: SettingsModel;
  public get settings(): Promise<SettingsModel> {
    if (!this._settings) {
      return this.dataRService.getSettings().then(res => (this._settings = res));
    } else {
      return new Promise<SettingsModel>(resolve => resolve(this._settings));
    }
  }

  constructor(private dataRService: DataReadService) {}

  public getSelectedLanguage(): Promise<string> {
    if (localStorage.getItem('selectedLanguage')) {
      return new Promise<string>(resolve => resolve((this.selectedLang = localStorage.getItem('selectedLanguage'))));
    } else {
      return this.settings.then(res => {
        localStorage.setItem('selectedLanguage', res.languages[0]);
        return (this.selectedLang = res.languages[0]);
      });
    }
  }

  public setSelectedLanguage(lang: string) {
    this.selectedLang = lang;
    localStorage.setItem('selectedLanguage', lang);
    this.languageChanged.emit(lang);
  }
}
