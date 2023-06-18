import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../models/Comment';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() isAnonymous: boolean = true;
  
  @Input() comment: Comment; /*= {
    "agencyId": "6481b63d10d440a713a33db1",
    "comment": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio, voluptate. Repellendus ad quidem soluta quo qui voluptas quaerat a fuga temporibus. Ducimus, voluptatem nesciunt quod, commodi rem qui officiis vel iusto sunt modi saepe alias fugit pariatur at nobis quidem velit, et quas sequi. Veritatis repellendus neque perspiciatis natus quaerat?",
    "grade": 4,
    "authorUsername": "Arsa",
    "authorFirstname": "Arsenije",
    "authorLastname": "Simonovic",
    "authorImgType": ".png"
  };*/

  imageSrc: string = "assets/user-default.png";

  constructor() { }

  ngOnInit(): void {
    if(this.comment.authorImgType && !this.isAnonymous) {
      this.imageSrc = `${GlobalConstants.URI}/images/${this.comment.authorUsername}/profileImg${this.comment.authorImgType}`; 
    }
  }

  repeatFor(repeatCount: number) {
    return Array(repeatCount);
  }

}