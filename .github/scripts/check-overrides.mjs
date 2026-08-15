#!/usr/bin/env node
// package.json の overrides が完全固定 (例: "4.3.0") になっていないか検査する。
// 完全固定すると Dependabot が脆弱性修正版への更新経路を作れず
// security_update_not_possible で失敗するため、範囲指定 (例: "^4.3.1") を必須とする。

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const packageJsonPath = path.join(repoRoot, 'package.json');

const RANGE_PREFIX = /^(\^|~|>|<|\*$)/;

function collectPinnedOverrides(overrides, trail = []) {
	const pinned = [];

	for (const [name, value] of Object.entries(overrides ?? {})) {
		const currentTrail = [...trail, name];

		if (value !== null && typeof value === 'object') {
			pinned.push(...collectPinnedOverrides(value, currentTrail));
			continue;
		}

		if (typeof value !== 'string') {
			continue;
		}

		// "$dep" 形式は依存側の指定を参照するため対象外。
		if (value.startsWith('$')) {
			continue;
		}

		if (!RANGE_PREFIX.test(value.trim())) {
			pinned.push({ name: currentTrail.join(' > '), version: value });
		}
	}

	return pinned;
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const pinned = collectPinnedOverrides(packageJson.overrides);

if (pinned.length > 0) {
	console.error('package.json の overrides に完全固定の指定があります:');
	for (const { name, version } of pinned) {
		console.error(`  - ${name}: "${version}"`);
	}
	console.error('');
	console.error('完全固定は Dependabot の脆弱性更新を security_update_not_possible で失敗させます。');
	console.error('"^4.3.1" のような範囲指定に変更してください。');
	process.exit(1);
}

console.log(`overrides check passed (${Object.keys(packageJson.overrides ?? {}).length} entries)`);
