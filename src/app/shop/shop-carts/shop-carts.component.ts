import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { AddItemToCartComponent } from './dialogs/add-item-to-cart/add-item-to-cart.component';
import { AddRecipeToCartComponent } from './dialogs/add-recipe-to-cart/add-recipe-to-cart.component';

import { IShopItem } from '../shop-item/shop-item';
import { IShopItemCategory } from '../shop-item/shop-item-category';
import { ShopCartsService } from '../shop-carts/shop-carts.service';
import { LODASH_TOKEN } from '../../shared/lodash.service';

@Component({
  templateUrl: './shop-carts.component.html',
  styleUrls: ['./shop-carts.component.scss']
})
export class ShopCartsComponent implements OnInit {
  cartItems: IShopItem[];
  categories: IShopItemCategory[];
  cartItemsPerCategory: Object;
  isShopping = false;

  constructor(public _dialogService: MdDialog,
              @Inject(LODASH_TOKEN) private _: any,
              private _shopCartsService: ShopCartsService) { }

  ngOnInit() {
    this.cartItems = this._shopCartsService.getCartItems();
  }

  toggleShopMode() {
    this.isShopping = !this.isShopping;
  }



  openItemsDialog() {
    const dialogRef: MdDialogRef<AddItemToCartComponent> = this._dialogService.open(AddItemToCartComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(items => {
      this.addItemToCart(items);
    });
  }

  openRecipesDialog() {
    const dialogRef: MdDialogRef<AddRecipeToCartComponent> = this._dialogService.open(AddRecipeToCartComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(items => {
      this.addItemToCart(items);

    });
  }

  addItemToCart(items) {
    this.cartItems = this._shopCartsService.addCartItems(items);
    this.sortByCategory(this.cartItems);
  }

  incrementItem(itemId: number) {
    this._shopCartsService.incrementItem(itemId);
  }

  decrementItem(itemId: number) {
    this._shopCartsService.decrementItem(itemId);
    this.sortByCategory(this.cartItems);
  }

  toggleAddedToCart(item: IShopItem) {
    if (this.isShopping) {
      item.addedToCart = !item.addedToCart;
    }
  }

  sortByCategory(items: IShopItem[]) {
    console.log(this._.uniqBy(this.cartItems, item => item.category.id).map(item => item.category));
    const categoriesUnsorted = this._.uniqBy(this.cartItems, item => item.category.id).map(item => item.category);
    this.categories = this._.sortBy(categoriesUnsorted, [(category: IShopItemCategory) => category.name.toLowerCase()]);
    this.cartItemsPerCategory = this._.groupBy(this.cartItems, 'category.name');
  }

}
