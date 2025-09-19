import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Resource {
  title: string;
  link: string;
  topic: string;
  description?: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  completed: boolean;
}

@Component({
  selector: 'app-learning-resources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './learning-resources.component.html',
  styleUrls: ['./learning-resources.component.css']
})
export class LearningResourcesComponent {
  searchQuery: string = '';
  selectedTopic: string = 'All';
  topicRequest: string = '';
  requestSuccess: boolean = false;

  resources: Resource[] = [
    {
      title: 'Angular Basics',
      link: 'https://angular.io/start',
      topic: 'Angular',
      description: 'Start your Angular journey with official hands-on tutorials.',
      status: 'Completed',
      completed: true
    },
    {
      title: 'RxJS Operators Deep Dive',
      link: 'https://rxjs.dev/guide/operators',
      topic: 'RxJS',
      description: 'Learn key RxJS operators and their use cases in reactive programming.',
      status: 'In Progress',
      completed: false
    },
    {
      title: 'Tailwind CSS Guide',
      link: 'https://tailwindcss.com/docs',
      topic: 'Tailwind',
      description: 'Master utility-first styling using Tailwind CSS documentation.',
      status: 'Not Started',
      completed: false
    },
    {
      title: 'TypeScript Fundamentals',
      link: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
      topic: 'TypeScript',
      description: 'Understand core TypeScript concepts in just 5 minutes.',
      status: 'Completed',
      completed: true
    }
  ];

  get uniqueTopics(): string[] {
    return ['All', ...Array.from(new Set(this.resources.map(r => r.topic)))];
  }

  get filteredResources(): Resource[] {
    return this.resources.filter(resource =>
      (this.selectedTopic === 'All' || resource.topic === this.selectedTopic) &&
      (!this.searchQuery ||
        resource.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (resource.description && resource.description.toLowerCase().includes(this.searchQuery.toLowerCase())))
    );
  }

  submitTopicRequest(): void {
    if (this.topicRequest.trim()) {
      console.log('🎯 New topic request:', this.topicRequest);
      this.requestSuccess = true;

      // Auto-clear after 3 seconds
      setTimeout(() => {
        this.topicRequest = '';
        this.requestSuccess = false;
      }, 3000);
    }
  }
}
