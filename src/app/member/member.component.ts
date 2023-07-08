import { Component, OnInit } from '@angular/core';
import { MemberService } from '../services/member.service';
import { Member } from '../models/member.model';


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})

export class MemberComponent implements OnInit {
    members: Member[] = [];
    member: Member | null = null;
    isNewMember: boolean = true;  
  
    constructor(private memberService: MemberService) { }
  
    ngOnInit() {
      this.loadMembers();
      this.member = new Member();
    }
  
    loadMembers() {
      this.memberService.getMembers().subscribe(members => {
        this.members = members;
      });
    }
  
    saveMember() {
      if (this.isNewMember && this.member) {   
        this.memberService.addMember(this.member).subscribe(() => {
          this.resetForm();
          this.loadMembers();
        });
      } else if (!this.isNewMember && this.member) {        
        this.memberService.updateMember(this.member).subscribe(() => {
          this.resetForm();
          this.loadMembers();
        });
      }
    }
    
    editMember(member: Member) {
      this.member = { ...member };
      this.isNewMember = false;
    }
  
    deleteMember(member: Member) {
      this.memberService.deleteMember(member.id).subscribe(() => {
        this.loadMembers();
      });
    }
  
    resetForm() {
      this.member = new Member();
      this.isNewMember = true;
    }
  }
  