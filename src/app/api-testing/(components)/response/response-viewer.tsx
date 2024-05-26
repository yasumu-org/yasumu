'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@/components/ui/tabs';
import PrettyResponseViewer from './pretty-response-viewer';
import { ResponseHeaders } from './response-headers';
import { cn } from '@/lib/utils';
import { ResponseCookies } from './response-cookies';
import { ResponseStats } from './stats/response-stats';
import { useLayoutStore } from '@/stores/application/layout.store';

const content = JSON.stringify({
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
  },
  github: 'https://github.com/johndoe',
  twitter: 'https://twitter.com/johndoe',
  linkedIn: 'https://www.linkedin.com/in/johndoe',
  youtube: 'https://www.youtube.com/johndoe',
  facebook: 'https://www.facebook.com/johndoe',
  instagram: 'https://www.instagram.com/johndoe',
  discord: 'https://discord.gg/johndoe',
  phoneNumbers: [
    {
      type: 'home',
      number: '212 555-1234',
    },
    {
      type: 'office',
      number: '646 555-4567',
    },
  ],
  employed: true,
  children: [
    {
      name: 'Jennifer Doe',
      age: 5,
    },
    {
      name: 'John Doe Jr.',
      age: 3,
    },
    {
      name: 'John Doe III',
      age: 1,
    },
  ],
  spouse: {
    name: 'Jane Doe',
    age: 28,
  },
  hobbies: ['reading', 'swimming', 'biking'],
  friends: [
    {
      name: 'Alice',
      age: 29,
    },
    {
      name: 'Bob',
      age: 31,
    },
  ],
  education: {
    highSchool: 'Springfield High School',
    college: 'Springfield University',
  },
  work: {
    company: 'ACME Corporation',
    position: 'Software Engineer',
  },
  salary: 100000,
  bonus: 5000,
  startDate: '2022-01-01',
  endDate: '2023-01-01',
  projects: [
    {
      name: 'Project A',
      startDate: '2022-01-01',
      endDate: '2022-06-01',
    },
    {
      name: 'Project B',
      startDate: '2022-07-01',
      endDate: '2022-12-01',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
  languages: ['English', 'Spanish'],
  certifications: [
    'AWS Certified Solutions Architect',
    'Google Professional Cloud Architect',
  ],
  interests: ['music', 'travel', 'photography'],
  socialMedia: {
    twitter: 'https://twitter.com/johndoe',
    linkedIn: 'https://www.linkedin.com/in/johndoe',
  },
  website: 'https://johndoe.com',
  resume: 'https://johndoe.com/resume',
});

const headers = [
  {
    key: 'Content-Type',
    value: 'application/json',
  },
  {
    key: 'Content-Length',
    value: String(content.length),
  },
];

const cookies = [
  {
    name: 'cookie1',
    value: 'value1',
    domain: 'example.com',
    path: '/',
    expires: '2022-12-31',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  },
  {
    name: 'cookie2',
    value: 'value2',
    domain: 'example.com',
    path: '/',
    expires: '2022-12-31',
    httpOnly: false,
    secure: false,
    sameSite: 'none',
  },
  {
    name: 'cookie3',
    value: 'value3',
    domain: 'example.com',
    path: '/',
    expires: '2022-12-31',
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
  },
];

export default function ResponseViewer() {
  const { orientation } = useLayoutStore();

  return (
    <div className={cn(orientation === 'horizontal' ? 'px-2' : 'p-2')}>
      <Tabs defaultValue="pretty" className="rounded-b-none">
        <div className="flex items-center justify-between">
          <TabsList className="rounded-b-none border-x border-t">
            <TabsTrigger value="pretty">Pretty</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="headers">
              Headers{' '}
              <span className="text-green-500 text-sm ml-2">
                ({headers.length})
              </span>
            </TabsTrigger>
            <TabsTrigger value="cookies">
              Cookies{' '}
              <span className="text-green-500 text-sm ml-2">
                ({cookies.length})
              </span>
            </TabsTrigger>
          </TabsList>
          <ResponseStats />
        </div>
        <div
          className={cn(
            'border rounded-b-sm p-2 overflow-y-auto',
            orientation === 'vertical' ? 'max-h-[400px]' : 'max-h-[90vh]'
          )}
        >
          <TabsContent value="pretty">
            <PrettyResponseViewer content={content} />
          </TabsContent>
          <TabsContent value="raw">
            <pre
              className={cn('word-break-break-all whitespace-pre-wrap text-sm')}
            >
              {content}
            </pre>
          </TabsContent>
          <TabsContent value="headers">
            <ResponseHeaders headers={headers} />
          </TabsContent>

          <TabsContent value="cookies">
            <ResponseCookies cookies={cookies} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
