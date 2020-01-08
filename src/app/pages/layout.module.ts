import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LayoutRoutes } from './layout.routing';
import { HomepageComponent } from './homepage/homepage.component';
import { PageComponent } from './page/page.component';
import { PublicPostComponent } from './page/post/post.component';
import { FooterComponent } from './footer/footer.component';
import { ImgShellModule } from '../components/img-shell/img-shell.module';

@NgModule({
  imports: [CommonModule, LayoutRoutes, ImgShellModule],
  declarations: [LayoutComponent, FooterComponent, HomepageComponent, PageComponent, PublicPostComponent],
})
export class LayoutModule {}
