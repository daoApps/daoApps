#!/usr/bin/env python3
"""Test MCP API full test cases"""

import json
import time
import requests

BASE_URL = "http://localhost:8000/api/v1/mcp"

def log(msg):
    try:
        print(msg)
    except UnicodeEncodeError:
        # Fallback for encoding error on Windows console
        ascii_msg = msg.encode('ascii', 'replace').decode('ascii')
        print(ascii_msg)

def test_get_agents():
    log("\n=== Test 1: GET /api/v1/mcp/agents ===")
    start = time.time()
    response = requests.get(f"{BASE_URL}/agents")
    elapsed = time.time() - start
    log(f"Status: {response.status_code}")
    log(f"Response time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        log(f"Total agents: {data['total']}")
        log(f"First agent: {data['agents'][0]['name'] if data['agents'] else 'None'}")
        return data, elapsed
    else:
        log(f"Error: {response.text[:200]}")
        return None, elapsed

def test_create_collaboration():
    log("\n=== Test 2: POST /api/v1/mcp/collaboration ===")
    payload = {
        "title": "测试协作任务",
        "agent_ids": ["agent-planner", "agent-writer", "agent-coder"],
        "mode": "serial"
    }
    start = time.time()
    response = requests.post(f"{BASE_URL}/collaboration", json=payload)
    elapsed = time.time() - start
    log(f"Status: {response.status_code}")
    log(f"Response time: {elapsed:.3f}s")
    if response.status_code in (200, 201):
        data = response.json()
        log(f"session_id: {data['session_id']}")
        log(f"status: {data['status']}")
        return data, elapsed
    else:
        log(f"Error: {response.text[:200]}")
        return None, elapsed

def test_get_collaboration_status(session_id):
    log(f"\n=== Test 3: GET /api/v1/mcp/collaboration/{session_id} ===")
    start = time.time()
    response = requests.get(f"{BASE_URL}/collaboration/{session_id}")
    elapsed = time.time() - start
    log(f"Status: {response.status_code}")
    log(f"Response time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        log(f"title: {data['title']}")
        log(f"status: {data['status']}")
        log(f"progress: {data['progress']}")
        log(f"messages: {len(data['messages'])}")
        return data, elapsed
    else:
        log(f"Error: {response.text[:200]}")
        return None, elapsed

def test_cancel_collaboration(session_id):
    log(f"\n=== Test 4: DELETE /api/v1/mcp/collaboration/{session_id} ===")
    start = time.time()
    response = requests.delete(f"{BASE_URL}/collaboration/{session_id}")
    elapsed = time.time() - start
    log(f"Status: {response.status_code}")
    log(f"Response time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        log(f"Response: {data}")
        return data, elapsed
    else:
        log(f"Error: {response.text[:200]}")
        return None, elapsed

def test_invalid_session():
    log("\n=== Test 5: GET invalid session_id ===")
    start = time.time()
    response = requests.get(f"{BASE_URL}/collaboration/invalid-id-12345")
    elapsed = time.time() - start
    log(f"Status: {response.status_code}")
    log(f"Response time: {elapsed:.3f}s")
    log(f"Response: {response.text[:200]}")
    return response.status_code, elapsed

def test_case_1_simple_task():
    log("\n\n" + "="*50)
    log("TEST CASE 1: Simple task collaboration (2-3 agents)")
    log("="*50)
    log("Requirement: Write a simple personal blog homepage HTML code")
    log("Selected: 任务规划师 + 内容创作专家 + 编程工程师")
    payload = {
        "title": "编写一个简单的个人博客首页 HTML 代码",
        "agent_ids": ["agent-planner", "agent-writer", "agent-coder"],
        "mode": "serial"
    }
    start = time.time()
    response = requests.post(f"{BASE_URL}/collaboration", json=payload)
    elapsed = time.time() - start
    log(f"Status: {response.status_code}, Time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        session_id = data['session_id']
        log(f"Created session: {session_id}")
        return session_id
    else:
        log(f"Failed: {response.text}")
        return None

def test_case_2_complex_project():
    log("\n\n" + "="*50)
    log("TEST CASE 2: Complex project planning (multiple agents)")
    log("="*50)
    log("Requirement: Plan an AI multi-agent collaboration platform project, including tech selection, architecture design and development roadmap")
    log("Selected: 战略顾问 + 任务规划师 + 业务分析师 + 编程工程师")
    payload = {
        "title": "规划一个 AI 多智能体协作平台项目",
        "agent_ids": ["agent-consultant", "agent-planner", "agent-analyst", "agent-coder"],
        "mode": "serial"
    }
    start = time.time()
    response = requests.post(f"{BASE_URL}/collaboration", json=payload)
    elapsed = time.time() - start
    log(f"Status: {response.status_code}, Time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        session_id = data['session_id']
        log(f"Created session: {session_id}")
        return session_id
    else:
        log(f"Failed: {response.text}")
        return None

def test_case_3_cross_role_review():
    log("\n\n" + "="*50)
    log("TEST CASE 3: Cross-role review (writer + translator + reviewer)")
    log("="*50)
    log("Requirement: Write an English article about the impact of AI on software development, then translate and review it")
    log("Selected: 内容创作专家 -> 翻译专家 -> 业务分析师 (reviewer)")
    payload = {
        "title": "写一篇关于 AI 对软件开发影响的英文文章，然后翻译并评审",
        "agent_ids": ["agent-writer", "agent-translator", "agent-analyst"],
        "mode": "serial"
    }
    start = time.time()
    response = requests.post(f"{BASE_URL}/collaboration", json=payload)
    elapsed = time.time() - start
    log(f"Status: {response.status_code}, Time: {elapsed:.3f}s")
    if response.status_code == 200:
        data = response.json()
        session_id = data['session_id']
        log(f"Created session: {session_id}")
        return session_id
    else:
        log(f"Failed: {response.text}")
        return None

def test_case_4_boundary():
    log("\n\n" + "="*50)
    log("TEST CASE 4: Boundary cases testing")
    log("="*50)
    results = {}

    # 4.1: Only one agent
    log("\n-- Subcase 4.1: Only one agent selected --")
    payload = {
        "title": "Single agent test",
        "agent_ids": ["agent-planner"],
        "mode": "serial"
    }
    start = time.time()
    response = requests.post(f"{BASE_URL}/collaboration", json=payload)
    elapsed = time.time() - start
    log(f"Status: {response.status_code}, Time: {elapsed:.3f}s")
    results['single_agent'] = {'status': response.status_code, 'elapsed': elapsed}
    if response.status_code == 200:
        data = response.json()
        log(f"  -> session_id: {data['session_id']} (SUCCESS)")
        results['single_agent']['session_id'] = data['session_id']
    else:
        log(f"  -> FAILED: {response.text[:100]}")

    # 4.2: All 8 agents selected
    log("\n-- Subcase 4.2: All 8 agents selected --")
    agent_ids = [
        "agent-planner", "agent-writer", "agent-coder", "agent-researcher",
        "agent-designer", "agent-analyst", "agent-translator", "agent-consultant"
    ]
    payload = {
        "title": "Full system architecture document",
        "agent_ids": agent_ids,
        "mode": "serial"
    }
    start = time.time()
    response = requests.post(f"{BASE_URL}/collaboration", json=payload)
    elapsed = time.time() - start
    log(f"Status: {response.status_code}, Time: {elapsed:.3f}s")
    results['all_agents'] = {'status': response.status_code, 'elapsed': elapsed}
    if response.status_code == 200:
        data = response.json()
        log(f"  -> session_id: {data['session_id']} (SUCCESS, no crash)")
        results['all_agents']['session_id'] = data['session_id']
    else:
        log(f"  -> FAILED: {response.text[:100]}")

    # 4.3: Empty title
    log("\n-- Subcase 4.3: Empty title --")
    payload = {
        "title": "",
        "agent_ids": ["agent-planner"],
        "mode": "serial"
    }
    start = time.time()
    response = requests.post(f"{BASE_URL}/collaboration", json=payload)
    elapsed = time.time() - start
    log(f"Status: {response.status_code}, Time: {elapsed:.3f}s")
    results['empty_title'] = {'status': response.status_code, 'elapsed': elapsed}
    log(f"  -> Response: {response.text[:100]}")

    return results

def main():
    log("DeepResearch MCP API Integration Test")
    log("=" * 50)

    # 1. 基础 API 测试
    log("\n[Phase 1] Basic API connectivity test")
    agents_data, time1 = test_get_agents()
    create_data, time2 = test_create_collaboration()
    session_id = create_data['session_id'] if create_data else None
    if session_id:
        status_data, time3 = test_get_collaboration_status(session_id)
        cancel_data, time4 = test_cancel_collaboration(session_id)
    invalid_status, time5 = test_invalid_session()

    # 汇总基础测试结果
    log("\n[Phase 1] Summary:")
    log(f"  GET /agents: {'OK' if agents_data else 'FAIL'}, {time1:.3f}s")
    log(f"  POST /collaboration: {'OK' if create_data else 'FAIL'}, {time2:.3f}s")
    log(f"  GET /collaboration/{{id}}: {'OK' if status_data else 'FAIL'}, {time3:.3f}s")
    log(f"  DELETE /collaboration/{{id}}: {'OK' if cancel_data else 'FAIL'}, {time4:.3f}s")
    log(f"  GET invalid session: {invalid_status}, {time5:.3f}s")

    avg_api_time = (time1 + time2 + time3 + time4) / 4
    log(f"  Average API response time: {avg_api_time:.3f}s")

    # 2. 完整测试用例执行
    log("\n\n[Phase 2] Execute 5 test cases")

    test_cases = [
        ("TC1: Simple task (2-3 agents)", test_case_1_simple_task),
        ("TC2: Complex planning (multiple agents)", test_case_2_complex_project),
        ("TC3: Cross-role review", test_case_3_cross_role_review),
        ("TC4: Boundary cases", test_case_4_boundary),
    ]

    test_results = {}
    for name, test_func in test_cases:
        log(f"\n-- Running {name}")
        try:
            result = test_func()
            test_results[name] = {
                'result': result,
                'success': result is not None,
            }
        except Exception as e:
            log(f"  EXCEPTION: {e}")
            test_results[name] = {
                'result': None,
                'success': False,
                'exception': str(e),
            }

    # 最终汇总
    log("\n\n" + "=" * 50)
    log("FINAL TEST SUMMARY")
    log("=" * 50)

    total = len(test_cases)
    passed = sum(1 for v in test_results.values() if v['success'])
    failed = total - passed

    log(f"\nTotal test cases: {total}")
    log(f"Passed: {passed}, Failed: {failed}")

    all_times = [time1, time2, time3, time4, time5]
    avg_time = sum(all_times) / len(all_times)
    log(f"Average single API call time: {avg_time:.3f}s")

    success_rate = passed / total * 100
    log(f"Success rate: {success_rate:.1f}%")

    if failed == 0:
        log("\n✅ ALL TESTS PASSED!")
    else:
        log("\n⚠️  Some tests failed, please check above.")

if __name__ == "__main__":
    main()
