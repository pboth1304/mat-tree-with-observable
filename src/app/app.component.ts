import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';

interface Folder {
  id: string;
  title: string;
  children?: Folder[];
}

const FOLDERS: Folder[] = [
  {
    id: '1',
    title: 'Root',
    children: [
      { id: '2', title: 'subfolder 1' },
      { id: '3', title: 'subfolder 2' },
      { id: '4', title: 'subfolder 3' },
      {
        id: '5',
        title: 'subfolder 4',
        children: [{ id: '51', title: 'sub subfolder 1' }]
      }
    ]
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  levels = new Map<Folder, number>();

  treeFlattener: MatTreeFlattener<Folder, Folder>;

  treeControl: FlatTreeControl<Folder>;

  dataSource: MatTreeFlatDataSource<Folder, Folder>;

  constructor() {
    // constructor(private readonly store:Store<YourState>) {}

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );

    this.treeControl = new FlatTreeControl<Folder>(
      this.getLevel,
      this.isExpandable
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    // this.store.pipe(select(getFolders)).subscribe(folders => (this.dataSource.data = folders));
    of(FOLDERS).subscribe(folders => (this.dataSource.data = folders));

    setTimeout(() => {
      this.dataSource.data = [
        ...FOLDERS,
        {
          id: '15215',
          title: 'subfoldeager 1',
          children: [{ id: '21', title: 'subfolder 1212' }]
        }
      ];
    }, 3000);
  }

  getLevel = (node: Folder): number => {
    return this.levels.get(node) || 0;
  };

  transformer = (node: Folder, level: number) => {
    this.levels.set(node, level);
    return node;
  };

  isExpandable = (node: Folder) => {
    return node.children ? true : false;
  };

  hasChildren = (_: number, nodeData: Folder) => {
    return nodeData.children && nodeData.children.length;
  };

  getChildren = (node: Folder) => {
    return node.children;
  };
}
