#!/usr/bin/env python3
"""Test MCP API endpoints"""

import json
import time
import requests

BASE_URL = "http://localhost:8000/api/v1/mcp"

def test_get_agents():
    print("\n=== 测试 1: GET /api/v1/mcp/agents ===")
    start = time.time()
    response = requests.get(f"{BASE_URL}/agents")
    elapsed = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Response time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        print(f"Total agents: {data['total']}")
        print(f"First agent: {data['agents'][0]['name'] if data['agents'] else 'None'}")
        return data, elapsed
    else:
        print(f"Error: {response.text}")
        return None, elapsed

def test_create_collaboration():
    print("\n=== 测试 2: POST /api/v1/mcp/collaboration ===")
    payload = {
        "title": "测试协作任务",
        "agent_ids": ["agent-planner", "agent-writer", "agent-coder"],
        "mode": "serial"
    }
    start = time.time()
    response = requests.post(f"{BASE_URL}/collaboration", json=payload)
    elapsed = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Response time: {elapsed:.3f}s")
    if response.status_code in (200, 201):
        data = response.json()
        print(f"session_id: {data['session_id']}")
        print(f"status: {data['status']}")
        return data, elapsed
    else:
        print(f"Error: {response.text}")
        return None, elapsed

def test_get_collaboration_status(session_id):
    print(f"\n=== 测试 3: GET /api/v1/mcp/collaboration/{session_id} ===")
    start = time.time()
    response = requests.get(f"{BASE_URL}/collaboration/{session_id}")
    elapsed = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Response time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        print(f"title: {data['title']}")
        print(f"status: {data['status']}")
        print(f"progress: {data['progress']}")
        print(f"messages: {len(data['messages'])}")
        return data, elapsed
    else:
        print(f"Error: {response.text}")
        return None, elapsed

def test_cancel_collaboration(session_id):
    print(f"\n=== 测试 4: DELETE /api/v1/mcp/collaboration/{session_id} ===")
    start = time.time()
    response = requests.delete(f"{BASE_URL}/collaboration/{session_id}")
    elapsed = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Response time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        print(f"Response: {data}")
        return data, elapsed
    else:
        print(f"Error: {response.text}")
        return None, elapsed

def test_invalid_session():
    print("\n=== 测试 5: GET 无效 session_id ===")
    start = time.time()
    response = requests.get(f"{BASE_URL}/collaboration/invalid-id-12345")
    elapsed = time.time() - start
    print(f"Status: {response.status_code}")
    print(f"Response time: {elapsed:.3f}s")
    print(f"Response: {response.text[:200]}")
    return response.status_code, elapsed

def main():
    print("DeepResearch MCP API 集成测试")
    print("=" * 50)

    # 测试 1: 获取智能体列表
    agents_data, time1 = test_get_agents()
    if not agents_data:
        print("\n❌ 获取智能体列表失败，终止测试")
        return

    # 测试 2: 创建协作
    create_data, time2 = test_create_collaboration()
    if not create_data:
        print("\n❌ 创建协作失败，终止测试")
        return

    session_id = create_data['session_id']

    # 测试 3: 获取状态
    status_data, time3 = test_get_collaboration_status(session_id)

    # 测试 无效 session
    invalid_status, time5 = test_invalid_session()

    # 测试 取消协作
    cancel_data, time4 = test_cancel_collaboration(session_id)

    # 汇总统计
    print("\n" + "=" * 50)
    print("📊 测试汇总:")
    print(f"  1. GET /agents: 状态 {agents_data is not None}, 时间 {time1:.3f}s")
    print(f"  2. POST /collaboration: 状态 {create_data is not None}, 时间 {time2:.3f}s")
    print(f"  3. GET /collaboration/{{id}}: 状态 {status_data is not None}, 时间 {time3:.3f}s")
    print(f"  4. DELETE /collaboration/{{id}}: 状态 {cancel_data is not None}, 时间 {time4:.3f}s")
    print(f"  5. GET invalid session: 状态 {invalid_status}, 时间 {time5:.3f}s")

    total_time = time1 + time2 + time3 + (time4 if time4 else 0) + time5
    print(f"\n  总测试时间: {total_time:.3f}s")

    if agents_data and create_data and status_data:
        print("\n✅ 所有基础 API 测试通过!")
    else:
        print("\n⚠️  部分测试失败，请检查")

if __name__ == "__main__":
    main()
