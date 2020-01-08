import { Component, OnInit } from '@angular/core';
import { SettingsModel } from '@kumulus/ng-core';
import { ImgFormat } from '../services/img.service';
import { SettingsService } from '../services/settings.service';
import { ModuleLoaderService } from '../services/module-loader.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  public settings: SettingsModel;
  public navItems;
  public selectedLanguage;
  public imgFormat = ImgFormat.ORIGINAL;
  public logo;

  constructor(private settingsService: SettingsService, private moduleLoaderService: ModuleLoaderService) {}

  public ngOnInit() {
    this.settingsService
      .getSelectedLanguage()
      .then(lang => (this.selectedLanguage = lang))
      .then(lang => {
        this.settingsService.settings.then(res => {
          this.settings = res;
          this.navItems = this.settings.navigation.map(item => item.find(el => el.lang === lang));
        });
      });
    this.moduleLoaderService.getLogo().then(res => (this.logo = res));
  }

  public toggledLanguage(event) {
    this.selectedLanguage = event.target.value;
    this.settingsService.setSelectedLanguage(this.selectedLanguage);
    this.navItems = this.settings.navigation.map(item => item.find(el => el.lang === this.selectedLanguage));
  }
}
