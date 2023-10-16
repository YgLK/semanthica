import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Item} from "../../models/item";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {}

  classicSearch(searchQuery: string): Item[] {
    if (searchQuery === '') {
      return [];
    }
    // TODO
    return [];
  }

  semanticSearch(searchQuery: string): Item[] {
    if (searchQuery === '') {
      return [];
    }
    let itemsPrepared: Item[] = [];
    this.http.post(
      '/api/search/text',
      {
        "text_query": searchQuery,
        "top_k": 30,
      },
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe((data: any) => {
      data["items"].forEach((item_data: any) => {
        let item_content = item_data["content"];
        itemsPrepared.push(Item.createItem(item_content));
      })
    });
    return itemsPrepared;
  }

  imageSearch(imageUrl: string): Item[] {
    if (imageUrl === '') {
      return [];
    }
    let itemsPrepared: Item[] = [];
    this.http.post(
      '/api/search/image',
      {
        "image_url": imageUrl,
        "top_k": 30,
      },
      {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    ).subscribe((data: any) => {
      data["items"].forEach((item_data: any) => {
        let item_content = item_data["content"];
        itemsPrepared.push(Item.createItem(item_content));
      })
    });
    return itemsPrepared;
  }
}
