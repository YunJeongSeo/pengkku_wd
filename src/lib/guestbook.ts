// 개발: Vite 프록시 경유(CORS 우회) / 프로덕션: 직접 URL
const API = import.meta.env.DEV
	? '/api/gs/exec'
	: 'https://script.google.com/macros/s/AKfycbzsWf6AO0JX8j-xvDLws9Md5fAnsLtUTtlo-Mimtgwa50k2GCsnWSQlofin_eP2cz_s/exec';

export interface Msg {
	id: number;
	name: string;
	text: string;
	date: string;
}

export async function fetchMsgs(): Promise<Msg[]> {
	const res = await fetch(API);
	if (!res.ok) throw new Error('fetch failed');
	const raw: unknown = await res.json();
	const rows = Array.isArray(raw) ? raw : ((raw as { data?: unknown[] }).data ?? []);
	return (rows as Record<string, unknown>[]).map((r) => ({
		id: Number(r.IDX),
		name: String(r.NAME ?? ''),
		text: String(r.CONTENT ?? ''),
		date: String(r.REG_DT ?? ''),
	}));
}

export async function writeMsgs(name: string, content: string, password: string): Promise<void> {
	// no-cors: Google Apps Script redirect CORS 우회. 응답은 읽을 수 없으나 요청은 정상 처리됨
	await fetch(API, {
		method: 'POST',
		mode: 'no-cors',
		headers: { 'Content-Type': 'text/plain' },
		body: JSON.stringify({ action: 'write', name, content, password }),
	});
}

export async function deleteMsgs(idx: number, password: string): Promise<boolean> {
	await fetch(API, {
		method: 'POST',
		mode: 'no-cors',
		headers: { 'Content-Type': 'text/plain' },
		body: JSON.stringify({ action: 'delete', idx, password }),
	});
	// no-cors라 응답 확인 불가 → 1초 후 목록 새로고침으로 실제 삭제 여부 확인
	return true;
}
