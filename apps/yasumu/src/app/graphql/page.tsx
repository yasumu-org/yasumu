'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RequestTab, RequestTabs } from '../../components/RequestTabs';
import { SiGraphql } from 'react-icons/si';
import GraphqlInput from './(components)/GraphqlInput';
import { IoSync } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useYasumu } from '@/providers/WorkspaceProvider';
import { YasumuGraphqlEntity } from '@yasumu/core';
import {
  setGraphqlDocument,
  setGraphqlResult,
  setGraphqlSchema,
  useGraphqlDocument,
} from '@/stores/GraphqlSchemaStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import useDebounce from '@/hooks/use-debounce';

const icon = () => <SiGraphql className="text-pink-500 size-4" />;

export const graphqlDataTabs: RequestTab[] = [
  'Login',
  'Logout',
  'Register',
  'Current user',
  'Update current user',
  'List comments',
  'Create comment',
  'Update comment',
  'Delete comment',
  'List users',
  'Create user',
  'Update user',
  'Delete user',
  'List todos',
  'Create todo',
  'Update todo',
  'Delete todo',
  'Health check',
  'Ping',
].map((name) => ({
  icon,
  name,
}));

export default function Home() {
  const yasumu = useYasumu();
  const [entity, setEntity] = useState<YasumuGraphqlEntity | null>(null);
  const [url, setUrl] = useState('https://readonlydemo.vendure.io/shop-api');
  const debouncedUrl = useDebounce(url, 500);
  const [isIntrospecting, setIsIntrospecting] = useState(false);
  const schema = useGraphqlDocument();

  useEffect(() => {
    if (!yasumu.workspace) return;

    (async () => {
      console.log(yasumu.workspace?.getMetadata().getRawData());
      const target = Object.keys(yasumu.workspace!.getMetadata().getRawData().blocks.GraphQL.entities)[0];
      console.log({ target });
      if (!target) {
        const entity = await yasumu.workspace!.graphql.create({
          name: 'GraphQL Demo',
        });

        console.log({ entity });

        setEntity(entity);
        return;
      }

      const entity = await yasumu.workspace!.graphql.open(target);
      console.log({ entity });
      setEntity(entity);
      setUrl(entity.url || 'https://readonlydemo.vendure.io/shop-api');
      setGraphqlDocument(String(entity.data.blocks.Request.body || ''));
    })();
  }, [yasumu.workspace]);

  const introspect = async (auto = false) => {
    try {
      const workspace = yasumu.workspace;
      if (!workspace) {
        if (!auto) void toast.error('Workspace is not initialized');
        return;
      }
      if (!debouncedUrl) {
        if (!auto) void toast.error('Please enter a URL');
        return;
      }

      if ('canParse' in URL && !URL.canParse(debouncedUrl)) {
        if (!auto) void toast.error('Invalid URL');

        return;
      }

      try {
        new URL(debouncedUrl);
      } catch {
        if (!auto) void toast.error('Invalid URL');
        return;
      }

      if (!entity) {
        if (!auto) void toast.error('Entity is not initialized');
        return;
      }

      if (debouncedUrl !== entity.url && debouncedUrl) {
        entity.data.blocks.Request.url = debouncedUrl;

        await entity.save().catch(console.error);
      }

      setIsIntrospecting(true);
      const result = await entity.introspect();
      setGraphqlSchema(result);
      if (!auto) toast.success('Successfully introspected the GraphQL schema');
    } catch (e) {
      if (!auto)
        toast.error('Failed to introspect the GraphQL schema', {
          description: String(e),
        });
      console.error(e);
    } finally {
      setIsIntrospecting(false);
    }
  };

  useEffect(() => {
    introspect(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUrl]);

  console.log({ url: entity?.url });

  return (
    <main className="p-4 flex flex-col h-screen gap-4">
      <RequestTabs tabs={graphqlDataTabs} />
      <div className="flex gap-4">
        <Input
          placeholder="Enter a URL..."
          className="font-mono"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
        />
        <div className="flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => introspect()}>
            <IoSync
              className={cn({
                'animate-spin': isIntrospecting,
              })}
            />
          </Button>
          <Button
            onClick={async () => {
              try {
                const workspace = yasumu.workspace;
                if (!workspace) {
                  toast.error('Workspace is not initialized');
                  return;
                }
                if (!debouncedUrl) {
                  toast.error('Please enter a URL');
                  return;
                }

                if ('canParse' in URL && !URL.canParse(debouncedUrl)) {
                  toast.error('Invalid URL');
                  return;
                }

                try {
                  new URL(debouncedUrl);
                } catch {
                  toast.error('Invalid URL');
                  return;
                }

                if (!entity) {
                  toast.error('Entity is not initialized');
                  return;
                }

                entity.data.blocks.Request.url = debouncedUrl;
                entity.data.blocks.Request.body = schema;

                await entity.save().catch(console.error);

                const result = await entity.send({
                  query: schema,
                });

                if (!result) {
                  toast.error('Failed to send the request');
                  return;
                }

                setGraphqlResult(await result.json());
              } catch (e) {
                toast.error('Failed to send the request', {
                  description: String(e),
                });
              }
            }}
          >
            Send
          </Button>
        </div>
      </div>
      <Separator />
      <GraphqlInput />
    </main>
  );
}
