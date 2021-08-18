/* eslint-disable */
export default [
    {
        path: '/',
        name: 'main',
        component: () => import('@/views/Home.vue'),
        meta: {
            pageTitle: 'Main',
            breadcrumb: [
                {
                    text: 'Main',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/links',
        name: 'links',
        component: () => import('@/views/Links.vue'),
        meta: {
            pageTitle: 'Links',
            breadcrumb: [
                {
                    text: 'Links',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/files',
        name: 'files',
        component: () => import('@/views/Files.vue'),
        meta: {
            pageTitle: 'Files',
            breadcrumb: [
                {
                    text: 'Files',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/files/new',
        name: 'file-add',
        component: () => import('@/views/FileAdd.vue'),
    },
    {
        path: '/links/new',
        name: 'link-add',
        component: () => import('@/views/LinkAdd.vue'),
    },
    {
        path: '/links/:id',
        name: 'link-view',
        component: () => import('@/views/LinkView.vue'),
    },
    {
        path: '/ip/:addr',
        name: 'ip-view',
        component: () => import('@/views/IPView.vue'),
    },
]
