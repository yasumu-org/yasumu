use std::{collections::HashMap, time::Duration};

use reqwest::{self, Method};

pub async fn make_request(
    url: &str,
    method: &str,
    headers: HashMap<&str, &str>,
) -> Result<(u16, u128, reqwest::header::HeaderMap, String, String), reqwest::Error> {
    let req_method = match method {
        "GET" => Method::GET,
        "POST" => Method::POST,
        "PUT" => Method::PUT,
        "DELETE" => Method::DELETE,
        "PATCH" => Method::PATCH,
        "HEAD" => Method::HEAD,
        "OPTIONS" => Method::OPTIONS,
        _ => Method::default(),
    };

    let client = reqwest::Client::new();

    let mut header = reqwest::header::HeaderMap::new();

    for (key, value) in headers.iter() {
        header.insert(
            reqwest::header::HeaderName::from_bytes(key.as_bytes()).unwrap(),
            reqwest::header::HeaderValue::from_str(value).unwrap(),
        );
    }

    let req = client
        .request(req_method, url)
        .timeout(Duration::from_secs(20))
        .headers(header);

    let send_time = std::time::Instant::now();
    let res = req.send().await?;

    let response_time = send_time.elapsed().as_millis();

    let status = res.status().as_u16();
    let status_text = res
        .status()
        .canonical_reason()
        .to_owned()
        .unwrap_or("")
        .into();

    let headers = res.headers().clone();

    let body = res.text().await?;

    Ok((status, response_time, headers, body, status_text))
}
