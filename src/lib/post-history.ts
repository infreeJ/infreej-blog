import type { CollectionEntry } from 'astro:content';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type PostHistory = Record<string, { hash: string }>;

// 정적 페이지를 만들 때만 Git을 읽는다. 브라우저에는 결과 해시만 전달한다.
export async function getPostHistory(posts: CollectionEntry<'blog'>[]): Promise<PostHistory> {
    const history: PostHistory = {};
    const cwd = process.cwd();
    const git = async (args: string[]) => {
        const { stdout } = await execFileAsync('git', args, {
            cwd,
            encoding: 'utf8',
            timeout: 5000,
            windowsHide: true,
        });
        return stdout.trim();
    };

    try {
        // 얕은 복제의 경계 커밋을 글이 처음 추가된 커밋으로 오인하지 않는다.
        const shallowPath = await git(['rev-parse', '--git-path', 'shallow']);
        const shallowCommits = new Set(
            (await readFile(resolve(cwd, shallowPath), 'utf8').catch(() => '')).split(/\r?\n/).filter(Boolean),
        );

        for (const post of posts) {
            if (!post.filePath) continue;
            const additions = await git(['log', '--follow', '--diff-filter=A', '--format=%H', '--', post.filePath]);
            const firstCommit = additions.split(/\r?\n/).filter(Boolean).at(-1);
            if (firstCommit && !shallowCommits.has(firstCommit)) {
                history[post.id] = { hash: firstCommit.slice(0, 7) };
            }
        }
    } catch {
        // Git 없는 배포 환경에서도 글과 날짜는 정상적으로 출력한다.
        console.warn('[post-log] Git 이력을 읽을 수 없어 일부 커밋 해시를 생략합니다.');
    }

    return history;
}
