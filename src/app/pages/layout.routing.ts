import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PublicPostComponent } from './page/post/post.component';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomepageComponent,
      },
      {
        path: ':path',
        children: [
          {
            path: '',
            component: PageComponent,
          },
          {
            path: ':post',
            component: PublicPostComponent,
          },
        ],
      },
    ],
  },
];

export const LayoutRoutes = RouterModule.forChild(routes);
